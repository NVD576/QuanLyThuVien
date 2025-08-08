package com.nvd.library.services;

import com.nvd.library.pojo.Admin;

import java.util.List;

public interface AdminService {
    List<Admin> getAllAdmin();

    public Admin getAdminById(int id);

    public Admin addAdmin(Admin admin);

    public Admin updateAdmin(Admin admin);

    public void deleteAdmin(Admin admin);

}
