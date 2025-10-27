from django.db import migrations


def fix_authtoken_fk(apps, schema_editor):
    conn = schema_editor.connection
    db_name = conn.settings_dict.get('NAME')
    with conn.cursor() as cursor:
        # Encontra o nome da constraint FK que referencia auth_user (se existir)
        cursor.execute(
            """
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA=%s AND TABLE_NAME='authtoken_token' AND REFERENCED_TABLE_NAME='auth_user'
            """,
            [db_name],
        )
        row = cursor.fetchone()
        if row:
            fk_name = row[0]
            cursor.execute(f"ALTER TABLE `authtoken_token` DROP FOREIGN KEY `{fk_name}`")

        # Detect which user table actually exists in this environment
        cursor.execute(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=%s AND TABLE_NAME IN ('usuarios','usuariounificado')",
            [db_name],
        )
        user_table_row = cursor.fetchone()
        if not user_table_row:
            # nothing to do
            return
        user_table = user_table_row[0]

        # Se a FK já existir apontando para user_table, pule
        cursor.execute(
            "SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=%s AND TABLE_NAME='authtoken_token' AND REFERENCED_TABLE_NAME=%s",
            [db_name, user_table],
        )
        already = cursor.fetchone()[0]
        if not already:
            cursor.execute(
                f"ALTER TABLE `authtoken_token` ADD CONSTRAINT `authtoken_token_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `{user_table}` (`id_usuario`) ON DELETE CASCADE"
            )


def reverse_fix(apps, schema_editor):
    conn = schema_editor.connection
    db_name = conn.settings_dict.get('NAME')
    with conn.cursor() as cursor:
        # Remover FK apontando para usuarios ou usuariounificado (se existir)
        cursor.execute(
            "SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=%s AND TABLE_NAME='authtoken_token' AND REFERENCED_TABLE_NAME IN ('usuarios','usuariounificado')",
            [db_name],
        )
        row = cursor.fetchone()
        if row:
            cursor.execute(f"ALTER TABLE `authtoken_token` DROP FOREIGN KEY `{row[0]}`")

        # Recriar FK apontando para auth_user (apenas se auth_user.id existir) - conservador
        cursor.execute(
            "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=%s AND TABLE_NAME='auth_user'",
            [db_name],
        )
        if cursor.fetchone()[0] > 0:
            cursor.execute(
                "ALTER TABLE `authtoken_token` ADD CONSTRAINT `authtoken_token_user_id_fk_auth` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE"
            )


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_add_django_columns'),
    ]

    operations = [
        migrations.RunPython(fix_authtoken_fk, reverse_code=reverse_fix),
    ]
