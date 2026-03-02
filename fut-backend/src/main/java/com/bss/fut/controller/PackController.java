package com.bss.fut.controller;

import com.bss.fut.dto.PackResponseDTO;
import com.bss.fut.service.PackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/packs")
public class PackController {

    @Autowired
    private PackService packService;

    @PostMapping("/open/gold")
    public PackResponseDTO openGold(@RequestParam Long userId) {
        return packService.openGoldPack(userId);
    }
}
