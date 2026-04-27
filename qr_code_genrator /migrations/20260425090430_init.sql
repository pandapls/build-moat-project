-- Add migration script here
  CREATE TABLE qr_codes (                                                         
      token        VARCHAR(16) PRIMARY KEY,
      original_url TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),                            
      expires_at   TIMESTAMPTZ,
      deleted_at   TIMESTAMPTZ,                                                   
      scan_count   BIGINT NOT NULL DEFAULT 0
  );            