-- Arquivo: backend/sql/add_django_columns.sql
-- Objetivo: adicionar colunas mínimas exigidas pelo Django/ModelBackend
-- Recomendação: faça backup do banco antes de executar este script.

ALTER TABLE `usuarios`
  ADD COLUMN `last_login` DATETIME NULL AFTER `senha_hash`,
  ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1 AFTER `last_login`,
  ADD COLUMN `is_staff` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_active`,
  ADD COLUMN `is_superuser` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_staff`;

-- Observações:
-- 1) `senha_hash` é o nome atual da coluna de senha no seu schema (conforme model).
-- 2) Se quiser que is_active padrão seja 0, altere o DEFAULT.
-- 3) Após aplicar, execute `python3 manage.py makemigrations` e `python3 manage.py migrate`
--    apenas se você converter esse DDL em uma migration. Caso contrário, aplicar o SQL diretamente
--    já atualiza a tabela para permitir o uso do backend padrão.
