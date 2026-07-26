output "public_ip" {
  description = "IP público da VM de deploy."
  value       = oci_core_instance.catalog.public_ip
}

output "deploy_directory" {
  description = "Diretório preparado pelo cloud-init para receber o repositório."
  value       = "/opt/product-catalog"
}
