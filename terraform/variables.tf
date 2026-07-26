variable "tenancy_ocid" {
  description = "OCID da tenancy OCI."
  type        = string
  sensitive   = true
}

variable "compartment_ocid" {
  description = "OCID do compartment onde a infraestrutura será criada."
  type        = string
}

variable "region" {
  description = "Região OCI, por exemplo sa-saopaulo-1."
  type        = string
}

variable "image_ocid" {
  description = "OCID da imagem Ubuntu ARM64 disponível na região escolhida."
  type        = string
}

variable "ssh_public_key" {
  description = "Chave pública SSH autorizada na VM."
  type        = string
}

variable "ssh_allowed_cidr" {
  description = "CIDR autorizado a acessar SSH, por exemplo 203.0.113.10/32."
  type        = string
}

variable "instance_name" {
  description = "Nome da instância de deploy."
  type        = string
  default     = "product-catalog"
}

variable "instance_ocpus" {
  description = "OCPUs da VM.Standard.A1.Flex. Mantenha dentro da cota Always Free."
  type        = number
  default     = 2
}

variable "instance_memory_in_gbs" {
  description = "Memória da VM.Standard.A1.Flex. Mantenha dentro da cota Always Free."
  type        = number
  default     = 12
}
