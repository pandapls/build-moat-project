pub struct AppConfig {
    pub base_url: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            base_url: std::env::var("BASE_URL")
                .unwrap_or_else(|_| "http://localhost:8000".to_string()),
        }
    }
}
