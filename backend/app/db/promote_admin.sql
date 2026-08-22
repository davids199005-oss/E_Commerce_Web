SET @admin_username = 'admin';

UPDATE users
SET is_admin = TRUE
WHERE username = @admin_username;

-- Confirms the promotion. An empty result means the username above does not exist yet.
SELECT id, username, email, is_admin
FROM users
WHERE username = @admin_username;
