-- =========================
-- ENUM TYPES
-- =========================
CREATE TYPE user_role AS ENUM ('seeker', 'owner', 'both');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'any');
CREATE TYPE property_type_enum AS ENUM ('1BHK', '2BHK', 'Shared', 'PG');
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'video', 'system');
CREATE TYPE match_target_type AS ENUM ('user', 'property');
CREATE TYPE match_type_enum AS ENUM ('roommate', 'property');
CREATE TYPE match_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  email VARCHAR UNIQUE,
  password VARCHAR,
  phone VARCHAR,
  role user_role,
  profile_photo_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- =========================
-- MEDIA
-- =========================
CREATE TABLE media (
  media_id SERIAL PRIMARY KEY,
  url VARCHAR,
  type media_type,
  uploaded_by INT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  size_bytes DECIMAL,
  metadata TEXT,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

ALTER TABLE users
ADD CONSTRAINT fk_profile_photo
FOREIGN KEY (profile_photo_id) REFERENCES media(media_id);

-- =========================
-- SEEKER PROFILES
-- =========================
CREATE TABLE seeker_profiles (
  seeker_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE,
  gender VARCHAR,
  age INT,
  occupation VARCHAR,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE seeker_preferred_locations (
  location_id SERIAL PRIMARY KEY,
  seeker_id INT,
  location_name VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  priority INT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (seeker_id) REFERENCES seeker_profiles(seeker_id)
);

CREATE TABLE lifestyles (
  lifestyle_id SERIAL PRIMARY KEY,
  seeker_id INT,
  lifestyle_key VARCHAR,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (seeker_id) REFERENCES seeker_profiles(seeker_id)
);

CREATE TABLE roommate_preferences (
  pref_id SERIAL PRIMARY KEY,
  seeker_id INT,
  min_age INT,
  max_age INT,
  preferred_gender gender_type,
  allow_pets BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (seeker_id) REFERENCES seeker_profiles(seeker_id)
);

-- =========================
-- OWNER PROFILES
-- =========================
CREATE TABLE owner_profiles (
  owner_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE,
  kyc_verified BOOLEAN,
  rating DECIMAL,
  total_properties INT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================
-- PROPERTIES
-- =========================
CREATE TABLE properties (
  property_id SERIAL PRIMARY KEY,
  owner_id INT,
  title VARCHAR,
  description TEXT,
  city VARCHAR,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  rent DECIMAL,
  property_type property_type_enum,
  available_for gender_type,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owner_profiles(owner_id)
);

-- =========================
-- AMENITIES
-- =========================
CREATE TABLE amenity_catalog (
  amenity_id SERIAL PRIMARY KEY,
  key VARCHAR UNIQUE,
  label VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_amenities (
  id SERIAL PRIMARY KEY,
  property_id INT,
  amenity_id INT,
  details VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (property_id) REFERENCES properties(property_id),
  FOREIGN KEY (amenity_id) REFERENCES amenity_catalog(amenity_id)
);

-- =========================
-- PROPERTY PHOTOS
-- =========================
CREATE TABLE property_photos (
  photo_id SERIAL PRIMARY KEY,
  property_id INT,
  media_id INT,
  caption VARCHAR,
  sort_order INT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (property_id) REFERENCES properties(property_id),
  FOREIGN KEY (media_id) REFERENCES media(media_id)
);

-- =========================
-- CHAT SYSTEM
-- =========================
CREATE TABLE chats (
  chat_id SERIAL PRIMARY KEY,
  property_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  last_message_id INT,
  FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

CREATE TABLE chat_participants (
  participant_id SERIAL PRIMARY KEY,
  chat_id INT,
  user_id INT,
  joined_at TIMESTAMP DEFAULT NOW(),
  role VARCHAR,
  is_muted BOOLEAN,
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  chat_id INT,
  sender_id INT,
  content TEXT,
  media_id INT,
  message_type message_type_enum,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id),
  FOREIGN KEY (media_id) REFERENCES media(media_id)
);

-- =========================
-- MATCH REQUESTS
-- =========================
CREATE TABLE match_requests (
  match_id SERIAL PRIMARY KEY,
  seeker_id INT,
  target_type match_target_type,
  target_id INT,
  type match_type_enum,
  status match_status_enum,
  compatibility_score DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  FOREIGN KEY (seeker_id) REFERENCES users(user_id)
);

-- =========================
-- LIFESTYLE CATALOG
-- =========================
CREATE TABLE lifestyle_catalog (
  lifestyle_cat_id SERIAL PRIMARY KEY,
  key VARCHAR UNIQUE,
  label VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Owner KYC + property listing extras (kyc_documents, owner_profiles columns, properties columns)
-- used by backend/src/controllers/ownerPropertyController.ts — run:
-- \i backend/supabase/schema_extensions_api.sql