CREATE TABLE pages (
    project text,
    url text,
    data text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    scrape_method text NOT NULL DEFAULT 'axios'::text,
    input_metadata json,
    CONSTRAINT pages_pkey PRIMARY KEY (project, url)
);

CREATE OR REPLACE FUNCTION trigger_page_download()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.data IS NULL) OR (TG_OP = 'UPDATE' AND OLD.data IS NOT NULL AND NEW.data IS NULL) OR (OLD.scrape_method IS DISTINCT FROM NEW.scrape_method) THEN
    PERFORM graphile_worker.add_job(
      'downloadPage/' || NEW.scrape_method,
      json_build_object('project', NEW.project, 'url', NEW.url),
      job_key := NEW.project || '/' || NEW.url,
      job_key_mode := 'preserve_run_at'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_page_download ON pages;

CREATE TRIGGER trigger_page_download
  AFTER INSERT OR UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_page_download();
