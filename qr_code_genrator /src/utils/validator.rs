use anyhow::{Result, bail};
use url::Url;

pub fn validate_url(raw: &str) -> Result<String> {
    let parsed = Url::parse(raw)?;

    match parsed.scheme() {
        "http" | "https" => {}
        _ => bail!("Only http/https URLs are allowed"),
    }

    if let Some(host) = parsed.host_str() {
        if host == "localhost" || host.starts_with("127.") || host.starts_with("192.168.") {
            bail!("Private/local URLs are not allowed");
        }
    }

    Ok(parsed.to_string())
}
