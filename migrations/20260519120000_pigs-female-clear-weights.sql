-- Both pigs are female. Clear guessed live-weight estimates.
UPDATE animals
SET sex = 'female',
    estimated_live_weight_lbs = NULL
WHERE kind = 'pig';
