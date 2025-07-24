-- Ensure user_type enum exists
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('owner', 'supplier', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure the enum is properly defined with all required values
DO $$ BEGIN
    -- Check if we need to add any missing enum values
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'owner' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'owner';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'supplier' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'supplier';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'admin';
    END IF;
EXCEPTION
    WHEN others THEN null;
END $$;