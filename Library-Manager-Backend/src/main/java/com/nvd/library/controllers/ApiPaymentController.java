package com.nvd.library.controllers;

import com.nvd.library.configs.VNPayConfig;
import com.nvd.library.dto.PaymentDTO;
import com.nvd.library.dto.UpgradeRequestDTO;
import com.nvd.library.pojo.Fine;
import com.nvd.library.pojo.Payment;
import com.nvd.library.pojo.Reader;
import com.nvd.library.pojo.User;
import com.nvd.library.repository.PaymentRepository;
import com.nvd.library.services.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiPaymentController {
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private FineService fineService;
    @Autowired
    private BorrowService borrowService;
    @Autowired
    private PaymentRepository paymentRep;

    @Autowired
    private ReaderService readerService;

    private final VNPayConfig vnpConfig;

    public ApiPaymentController(VNPayConfig vnpConfig) {
        this.vnpConfig = vnpConfig;
    }

    @GetMapping("/payment/create")
    public ResponseEntity<?> createPayment(@RequestParam("amount") long amount,
                                           @RequestParam(value = "userId", required = false) Integer userId,
                                           @RequestParam(value = "fineId",  required = false) Integer  fineId,
                                           @RequestParam("reason") String reason,
                                           @RequestParam("type") String type) throws UnsupportedEncodingException {
        if (amount <= 0) {
            return ResponseEntity.badRequest().body("Số tiền phải lớn hơn 0");
        }
        Payment payment = new Payment();
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentType(type);
        payment.setAmount(BigDecimal.valueOf(amount));
        payment.setPaymentMethod("CreditCard");
        payment.setNote(reason);

        if(fineId != null) {
            Fine fine = this.fineService.getFineById(fineId);
            payment.setFine(fine);
            User user = this.userService.getUserById(fine.getBorrow().getUser().getId());
            payment.setUser(user);
        }
        else {
            User user = this.userService.getUserById(userId);
            payment.setUser(user);
        }


        payment.setStatus("Failed");
        Payment pay = this.paymentService.addPayment(payment);

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
        String vnp_IpAddr = "127.0.0.1";
        String orderType = "170000";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnpConfig.getVnp_TmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount *100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", String.valueOf(pay.getId()));
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", new SimpleDateFormat("yyyyMMddHHmmss").format(cal.getTime()));

        String returnUrl = vnpConfig.getVnp_ReturnUrl() + "?type=" + type;
        vnp_Params.put("vnp_ReturnUrl", returnUrl);

        // Sort params
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString())).append('&');
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString())).append('&');
            }
        }
        hashData.deleteCharAt(hashData.length() - 1);
        query.deleteCharAt(query.length() - 1);

        String vnp_SecureHash = hmacSHA512(vnpConfig.getVnp_HashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        String paymentUrl = vnpConfig.getVnp_Url() + "?" + query.toString();

        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", paymentUrl);

        return ResponseEntity.ok(result);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    @GetMapping("/payment/return")
    public void handleReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws Exception {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        String type = params.get("type");

        Map<String, String> sortedParams = new TreeMap<>(params);
        sortedParams.remove("vnp_SecureHash");

        StringBuilder signData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            if (entry.getKey().startsWith("vnp_")) {
                signData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString())).append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString())).append("&");
            }
        }
        signData.deleteCharAt(signData.length() - 1);

        String calculatedHash = hmacSHA512(vnpConfig.getVnp_HashSecret(), signData.toString());

        String frontendUrl = "http://localhost:3000/payments"; // ví dụ frontend React

        if (calculatedHash.equals(vnp_SecureHash)) {
            String status = "failure";
            if ("00".equals(params.get("vnp_ResponseCode"))) {
                status = "success";
                System.out.println("//////////////////////////////////////////////////");
                Payment payment= this.paymentService.getPaymentsById(Integer.valueOf(params.get("vnp_OrderInfo")));
                payment.setStatus("Successful");
                if(payment.getFine()!=null) {
                    payment.getFine().setStatus("Paid");
                    payment.getFine().setPaidDate(LocalDate.now());
                }
                // Nếu là Membership upgrade
                if ("Membership".equals(type)) {
                    Reader user=readerService.getReaderById(payment.getUser().getId());
                    user.setMembershipLevel("Premium");
                    readerService.updateReader(user);
                }
                paymentRep.save(payment);
            }
            response.sendRedirect(frontendUrl + "?status=" + status + "&amount=" + params.get("vnp_Amount") + "&type=" + type);
        } else {
            response.sendRedirect(frontendUrl + "?status=invalid-signature");
        }
    }


    @GetMapping("/payments")
    public ResponseEntity<Page<Payment>> getPayments(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok( paymentService.getPayments(userId, startDate, endDate,search, page, size));
    }



    @GetMapping("/payment/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(this.paymentService.getPaymentsById(id));
    }

    @PostMapping("/payment/add")
    public ResponseEntity<Payment> addPayment(@RequestBody PaymentDTO paymentDTO) {
        Payment payment = new Payment();
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentType(paymentDTO.getPaymentType());
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setNote(paymentDTO.getNote());
        payment.setFine(this.fineService.getFineById(paymentDTO.getFineId()));

        User user = this.userService.getUserById(paymentDTO.getUserId());
        if (user == null) {
            payment.setStatus("Failed");
            return ResponseEntity.ok(this.paymentService.addPayment(payment));
        }

        payment.setUser(user);

        payment.setStatus("Successful");

        return ResponseEntity.ok(this.paymentService.addPayment(payment));
    }

    @PatchMapping("/payment/update")
    public ResponseEntity<Payment> updatePayment(@RequestBody PaymentDTO paymentDTO) {
        Payment payment = paymentService.getPaymentsById(paymentDTO.getId());
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentType(paymentDTO.getPaymentType());
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setNote(paymentDTO.getNote());
        payment.setStatus(paymentDTO.getStatus());

        User user = this.userService.getUserById(paymentDTO.getUserId());
        if (user == null) {
            payment.setStatus("Failed");
        } else {
            payment.setUser(user);
            payment.setStatus(paymentDTO.getStatus() != null ? paymentDTO.getStatus() : "Pending");
        }
        return ResponseEntity.ok(this.paymentService.updatePayment(payment));
    }

    @DeleteMapping("/payment/{id}/delete")
    public ResponseEntity<?> deletePaymentById(@PathVariable Integer id) {
        this.paymentService.deletePaymentById(id);
        return ResponseEntity.ok("Delete Payment Successfully");
    }

}
