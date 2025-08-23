provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_dns_record" "A_record_base" {
  zone_id  = "97cf71d0ce900d68bf9dfdd0398ba3ea"
  name     = "jordanwhite.dev"
  ttl      = 1
  type     = "A"
  content  = "63.35.131.173"
  proxied  = true
  settings = {}
}

resource "cloudflare_dns_record" "A_record_prefixed" {
  zone_id  = "97cf71d0ce900d68bf9dfdd0398ba3ea"
  name     = "www.jordanwhite.dev"
  ttl      = 1
  type     = "A"
  content  = "63.35.131.173"
  proxied  = true
  settings = {}
}

resource "cloudflare_dns_record" "TXT_record_dmarc" {
  zone_id  = "97cf71d0ce900d68bf9dfdd0398ba3ea"
  name     = "_dmarc.jordanwhite.dev"
  ttl      = 1
  type     = "TXT"
  content  = "\"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;\""
  proxied  = false
  settings = {}
}

resource "cloudflare_dns_record" "TXT_record_domainkey" {
  zone_id  = "97cf71d0ce900d68bf9dfdd0398ba3ea"
  name     = "*._domainkey.jordanwhite.dev"
  ttl      = 1
  type     = "TXT"
  content  = "\"v=DKIM1; p=\""
  proxied  = false
  settings = {}
}

resource "cloudflare_dns_record" "TXT_record_jwdev" {
  zone_id  = "97cf71d0ce900d68bf9dfdd0398ba3ea"
  name     = "jordanwhite.dev"
  ttl      = 1
  type     = "TXT"
  content  = "\"v=spf1 -all\""
  proxied  = false
  settings = {}
}
