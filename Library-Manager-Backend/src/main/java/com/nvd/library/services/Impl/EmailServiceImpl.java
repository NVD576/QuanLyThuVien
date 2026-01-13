package com.nvd.library.services.Impl;

import com.nvd.library.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Override
    public void sendOverdueReminder(String to, String username, String bookTitle, LocalDate dueDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Thông báo nhắc nhở về việc trả sách quá hạn");

        message.setText("Kính gửi " + username + ",\n\n" +
                "Chúng tôi xin trân trọng thông báo rằng bạn đã mượn cuốn sách \"" + bookTitle + "\" " +
                "và thời hạn trả sách đã kết thúc vào ngày " + dueDate + ". Hiện nay, hệ thống ghi nhận rằng " +
                "bạn vẫn chưa hoàn tất việc hoàn trả cuốn sách này.\n\n" +
                "Để đảm bảo quyền lợi mượn sách trong tương lai và tránh phát sinh các khoản phạt không mong muốn, " +
                "chúng tôi kính đề nghị bạn vui lòng sắp xếp thời gian đến thư viện để hoàn trả sách trong thời gian sớm nhất.\n\n" +
                "Nếu bạn đã trả sách nhưng hệ thống chưa kịp cập nhật, xin vui lòng bỏ qua thông báo này. " +
                "Trong trường hợp có bất kỳ thắc mắc nào, bạn có thể liên hệ trực tiếp với thư viện để được hỗ trợ.\n\n" +
                "Trân trọng cảm ơn sự hợp tác của bạn!\n\n" +
                "Thư viện Trường Đại học XYZ");

        mailSender.send(message);
    }

}
