---
name: z-explorer-stack-detection
description: "Nhận diện ngôn ngữ, framework, phiên bản, lệnh build/test."
---

# z-explorer-stack-detection

Thuộc agent: `az-explorer`

## Mục đích
Nhận diện ngôn ngữ, framework, phiên bản, lệnh build/test.

## Các bước
1. Đọc file khai báo: package.json, requirements.txt, pyproject.toml, go.mod, pom.xml, composer.json, Gemfile…
2. Ghi phiên bản runtime và thư viện chính.
3. Tìm lệnh chạy, build, test, lint (scripts, Makefile, CI config).

## Đầu ra
`.az/codebase-map.md` mục 'Stack & lệnh'.

## Hoàn thành khi
- Đầu ra đã được ghi vào đúng file.
- Report có bằng chứng thực tế (output lệnh), không chỉ mô tả.
- Mọi điểm cần người dùng quyết định đã được chuyển về `saz-orchestrator`.
