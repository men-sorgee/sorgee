# VPC and Subnets
module "vpc-development" {
    source  = "terraform-google-modules/network/google"
    version = "~> 5.0"

    project_id   = module.gnh-development.project_id
    network_name = "vpc-development"
    routing_mode = "GLOBAL"

    subnets = [
       
        {
            subnet_name           = "central"
            subnet_ip             = "10.0.0.0/24"
            subnet_region         = "us-central1"
            subnet_private_access = true
            subnet_flow_logs      = true
            subnet_flow_logs_sampling = "0.5"
            subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
            subnet_flow_logs_interval = "INTERVAL_10_MIN"
        },
        {
            subnet_name           = "east"
            subnet_ip             = "10.0.1.0/24"
            subnet_region         = "us-east1"
            subnet_private_access = true
            subnet_flow_logs      = true
            subnet_flow_logs_sampling = "0.5"
            subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
            subnet_flow_logs_interval = "INTERVAL_10_MIN"
        },
    ]
}
# Firewall Rules
resource "google_compute_firewall" "vpc-development-allow-iap-rdp" {
  name      = "vpc-development-allow-iap-rdp"
  network   = module.vpc-development.network_name
  project   = module.gnh-development.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "tcp"
    ports    = ["3389",]
  }

  source_ranges = [
  "35.235.240.0/20",
  ]
}
resource "google_compute_firewall" "vpc-development-allow-iap-ssh" {
  name      = "vpc-development-allow-iap-ssh"
  network   = module.vpc-development.network_name
  project   = module.gnh-development.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "tcp"
    ports    = ["22",]
  }

  source_ranges = [
  "35.235.240.0/20",
  ]
}
resource "google_compute_firewall" "vpc-development-allow-icmp" {
  name      = "vpc-development-allow-icmp"
  network   = module.vpc-development.network_name
  project   = module.gnh-development.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "icmp"
  }

  source_ranges = [
  "10.128.0.0/9",
  ]
}
# NAT Router and config

# VPC and Subnets
module "vpc-gnh" {
    source  = "terraform-google-modules/network/google"
    version = "~> 5.0"

    project_id   = module.gnh-production.project_id
    network_name = "vpc-gnh"
    routing_mode = "GLOBAL"

    subnets = [
       
        {
            subnet_name           = "gnh"
            subnet_ip             = "10.0.0.0/24"
            subnet_region         = "us-west1"
            subnet_private_access = true
            subnet_flow_logs      = true
            subnet_flow_logs_sampling = "0.5"
            subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
            subnet_flow_logs_interval = "INTERVAL_10_MIN"
        },
        {
            subnet_name           = "tbg"
            subnet_ip             = "10.0.1.0/24"
            subnet_region         = "us-east4"
            subnet_private_access = true
            subnet_flow_logs      = true
            subnet_flow_logs_sampling = "0.5"
            subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
            subnet_flow_logs_interval = "INTERVAL_10_MIN"
        },
    ]
}
# Firewall Rules
resource "google_compute_firewall" "vpc-gnh-allow-iap-rdp" {
  name      = "vpc-gnh-allow-iap-rdp"
  network   = module.vpc-gnh.network_name
  project   = module.gnh-production.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "tcp"
    ports    = ["3389",]
  }

  source_ranges = [
  "35.235.240.0/20",
  ]
}
resource "google_compute_firewall" "vpc-gnh-allow-iap-ssh" {
  name      = "vpc-gnh-allow-iap-ssh"
  network   = module.vpc-gnh.network_name
  project   = module.gnh-production.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "tcp"
    ports    = ["22",]
  }

  source_ranges = [
  "35.235.240.0/20",
  ]
}
resource "google_compute_firewall" "vpc-gnh-allow-icmp" {
  name      = "vpc-gnh-allow-icmp"
  network   = module.vpc-gnh.network_name
  project   = module.gnh-production.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "icmp"
  }

  source_ranges = [
  "10.128.0.0/9",
  ]
}
# NAT Router and config

# VPC and Subnets
module "vpc-stage" {
    source  = "terraform-google-modules/network/google"
    version = "~> 5.0"

    project_id   = module.gnh-stage.project_id
    network_name = "vpc-stage"
    routing_mode = "GLOBAL"

    subnets = [
       
        {
            subnet_name           = "central"
            subnet_ip             = "10.0.0.0/24"
            subnet_region         = "us-central1"
            subnet_private_access = true
            subnet_flow_logs      = true
            subnet_flow_logs_sampling = "0.5"
            subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
            subnet_flow_logs_interval = "INTERVAL_10_MIN"
        },
        {
            subnet_name           = "east"
            subnet_ip             = "10.0.1.0/24"
            subnet_region         = "us-east1"
            subnet_private_access = true
            subnet_flow_logs      = true
            subnet_flow_logs_sampling = "0.5"
            subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
            subnet_flow_logs_interval = "INTERVAL_10_MIN"
        },
    ]
}
# Firewall Rules
resource "google_compute_firewall" "vpc-stage-allow-iap-rdp" {
  name      = "vpc-stage-allow-iap-rdp"
  network   = module.vpc-stage.network_name
  project   = module.gnh-stage.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "tcp"
    ports    = ["3389",]
  }

  source_ranges = [
  "35.235.240.0/20",
  ]
}
resource "google_compute_firewall" "vpc-stage-allow-iap-ssh" {
  name      = "vpc-stage-allow-iap-ssh"
  network   = module.vpc-stage.network_name
  project   = module.gnh-stage.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "tcp"
    ports    = ["22",]
  }

  source_ranges = [
  "35.235.240.0/20",
  ]
}
resource "google_compute_firewall" "vpc-stage-allow-icmp" {
  name      = "vpc-stage-allow-icmp"
  network   = module.vpc-stage.network_name
  project   = module.gnh-stage.project_id
  direction = "INGRESS"
  priority  = 10000

  log_config {
      metadata = "INCLUDE_ALL_METADATA"
    }

  allow {
    protocol = "icmp"
  }

  source_ranges = [
  "10.128.0.0/9",
  ]
}
# NAT Router and config
