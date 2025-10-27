from django.db import migrations


def add_columns(apps, schema_editor):
    """Adiciona apenas as colunas que ainda não existem usando queries condicionais.

    Executa ALTER TABLE separados para evitar problemas de sintaxe com cláusulas
    "IF NOT EXISTS" encadeadas em alguns ambientes/DB drivers.
    """
    conn = schema_editor.connection
    db_name = conn.settings_dict.get('NAME')

    with conn.cursor() as cursor:
        # Detect which table name exists in this database environment: prefer 'usuarios'
        cursor.execute(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=%s AND TABLE_NAME IN ('usuarios','usuariounificado')",
            [db_name],
        )
        row = cursor.fetchone()
        if not row:
            # No related table found; nothing to do in this environment
            return
        user_table = row[0]

        cursor.execute(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s",
            [db_name, user_table],
        )
        existing = {r[0] for r in cursor.fetchall()}

        if 'last_login' not in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` ADD COLUMN `last_login` DATETIME NULL")
        if 'is_active' not in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1")
        if 'is_staff' not in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` ADD COLUMN `is_staff` TINYINT(1) NOT NULL DEFAULT 0")
        if 'is_superuser' not in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` ADD COLUMN `is_superuser` TINYINT(1) NOT NULL DEFAULT 0")


def remove_columns(apps, schema_editor):
    conn = schema_editor.connection
    db_name = conn.settings_dict.get('NAME')

    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=%s AND TABLE_NAME IN ('usuarios','usuariounificado')",
            [db_name],
        )
        row = cursor.fetchone()
        if not row:
            return
        user_table = row[0]

        cursor.execute(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s",
            [db_name, user_table],
        )
        existing = {r[0] for r in cursor.fetchall()}

        if 'last_login' in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` DROP COLUMN `last_login`")
        if 'is_active' in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` DROP COLUMN `is_active`")
        if 'is_staff' in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` DROP COLUMN `is_staff`")
        if 'is_superuser' in existing:
            cursor.execute(f"ALTER TABLE `{user_table}` DROP COLUMN `is_superuser`")


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_columns, reverse_code=remove_columns),
    ]

