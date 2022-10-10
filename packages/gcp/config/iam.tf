module "organization-iam" {
  source  = "terraform-google-modules/iam/google//modules/organizations_iam"
  version = "~> 7.4"

  organizations = ["1044148098024"]

  bindings = {
    
    "roles/billing.admin" = [
      "group:gcp-billing-admins@thebrotherhoodgroup.org",
    ]
    
    "roles/resourcemanager.organizationAdmin" = [
      "group:gcp-organization-admins@thebrotherhoodgroup.org",
    ]
    
  }
}


module "development-iam" {
  source  = "terraform-google-modules/iam/google//modules/folders_iam"
  version = "~> 7.4"

  folders = [google_folder.development.name]

  bindings = {
    
    "roles/compute.instanceAdmin.v1" = [
      "group:gcp-developers@thebrotherhoodgroup.org",
    ]
    
    "roles/container.admin" = [
      "group:gcp-developers@thebrotherhoodgroup.org",
    ]
    
  }
}


module "stage-iam" {
  source  = "terraform-google-modules/iam/google//modules/folders_iam"
  version = "~> 7.4"

  folders = [google_folder.stage.name]

  bindings = {
    
    "roles/compute.instanceAdmin.v1" = [
      "group:gcp-developers@thebrotherhoodgroup.org",
    ]
    
    "roles/container.admin" = [
      "group:gcp-developers@thebrotherhoodgroup.org",
    ]
    
  }
}
