package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Admin;
import com.nvd.library.pojo.User;
import com.nvd.library.repository.AdminRepository;
import com.nvd.library.repository.UserRepository;
import com.nvd.library.services.AdminService;
import com.nvd.library.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserService userService;

    @Override
    public List<Admin> getAllAdmin() {
        return this.adminRepository.findAll();
    }

    @Override
    public Admin getAdminById(int id) {
        Optional<Admin> admin = this.adminRepository.findById(id);
        return admin.orElse(null);
    }

    @Override
    @Transactional
    public Admin addAdmin(Admin admin) {

        return this.adminRepository.save(admin);
    }

    @Override
    @Transactional
    public Admin updateAdmin(Admin admin) {

        return adminRepository.save(admin);
    }

    @Override
    @Transactional
    public void deleteAdmin(Admin admin) {
        if (admin == null){
            throw new IllegalArgumentException("Admin not found");
        }

        this.adminRepository.delete(admin);
    }
}
