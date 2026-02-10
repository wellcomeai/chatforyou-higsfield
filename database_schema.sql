
-- Схема базы данных NeuroForge AI Aggregator
-- Этот файл служит справочником для интеграции фронтенда с бэкенд-API.

-- 1. Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    credits_balance INT DEFAULT 0, -- Текущий баланс кредитов
    bot_id INT DEFAULT NULL, -- ID бота для API запросов
    bot_token VARCHAR(255) DEFAULT 'XXXXXXXXXXXXXXXXXXX', -- Токен бота для API запросов
    preferred_lang ENUM('en', 'ru') DEFAULT 'ru',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- 2. Тарифные планы (Соответствует структуре в Pricing.tsx)
CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_code VARCHAR(50) NOT NULL, -- 'basic', 'pro', 'ultimate', 'creator'
    billing_cycle ENUM('monthly', 'annual', 'biennial') NOT NULL,
    price_rub DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    credits_per_month INT NOT NULL,
    
    -- Лимиты на одновременные задачи
    max_concurrent_video INT DEFAULT 0,
    max_concurrent_image INT DEFAULT 0,
    max_concurrent_character INT DEFAULT 0,
    
    -- Булевы флаги функционала
    has_early_access BOOLEAN DEFAULT FALSE,
    has_all_features BOOLEAN DEFAULT FALSE,
    extra_credits_discount_pct INT DEFAULT 0,
    cinematic_bundle_free_gens INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Активные подписки пользователей
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'canceled', 'expired', 'past_due') DEFAULT 'active',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- 4. Уровни доступа к инструментам (Реализует логику No Access / Unlimited)
CREATE TABLE plan_tool_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    tool_id VARCHAR(100) NOT NULL, -- ID из tools/registry.ts
    access_level ENUM('denied', 'access', 'unlimited') DEFAULT 'denied',
    max_quality VARCHAR(10) DEFAULT '1K',
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- 5. История генераций (Задачи)
CREATE TABLE generation_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tool_id VARCHAR(100) NOT NULL,
    api_task_id VARCHAR(255), -- ID задачи из ProTalk API
    status ENUM('pending', 'processing', 'done', 'error') DEFAULT 'pending',
    prompt TEXT,
    params_json JSON,
    output_url TEXT,
    cost_credits INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_tool (user_id, tool_id),
    INDEX idx_api_task (api_task_id)
);

-- 6. Транзакции по кредитам
CREATE TABLE credit_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount INT NOT NULL,
    transaction_type ENUM('subscription_grant', 'purchase', 'usage', 'bonus', 'refund') NOT NULL,
    description VARCHAR(255),
    task_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES generation_tasks(id) ON DELETE SET NULL
);

-- 7. История платежей
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL, -- 'RUB', 'USD'
    payment_method VARCHAR(50),
    external_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
