use anyhow::Result;
use qrcode_generator::QrCodeEcc;

pub fn generate_qr_png(content: &str) -> Result<Vec<u8>> {
    let bytes = qrcode_generator::to_png_to_vec(content, QrCodeEcc::Medium, 256)?;
    Ok(bytes)
}
