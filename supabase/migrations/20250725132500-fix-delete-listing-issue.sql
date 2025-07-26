-- Alter the foreign key constraint on saved_parts to use ON DELETE SET NULL
ALTER TABLE public.saved_parts
DROP CONSTRAINT saved_parts_part_id_fkey,
ADD CONSTRAINT saved_parts_part_id_fkey
  FOREIGN KEY (part_id)
  REFERENCES public.car_parts(id)
  ON DELETE SET NULL;
