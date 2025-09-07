INSERT INTO universities (name, domain)
VALUES
  ('Stanford University', 'stanford.edu'),
  ('University of California, Berkeley', 'berkeley.edu'),
  ('National University of Singapore', 'u.nus.edu')
ON CONFLICT (domain) DO NOTHING;
