module "gnh-development" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-development"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}

module "gnh-development-monitoring" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-development-monitoring"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}

module "gnh-logging" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-logging"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}

module "gnh-production" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-production"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}

module "gnh-production-monitoring" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-production-monitoring"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}

module "gnh-stage" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-stage"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}

module "gnh-stage-monitoring" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 12.0"

  name       = "gnh-stage-monitoring"
  org_id     = var.org_id
  folder_id  = google_folder.common.name

  billing_account = var.billing_account
}
