# Guía de Despliegue en AWS con Terraform

## 📋 Arquitectura

**Servicios utilizados:**
- **S3**: Hosting de archivos estáticos del frontend
- **CloudFront**: CDN global con HTTPS automático
- **GitHub Actions**: CI/CD para despliegue automático

**Flujo de despliegue:**
```
GitHub → GitHub Actions → Build Angular → S3 → CloudFront → Usuarios
```

**Ventajas de esta arquitectura:**
- ✅ Súper económico (casi gratis con Free Tier)
- ✅ HTTPS automático sin certificados manuales
- ✅ Distribución global con baja latencia
- ✅ Deploy automático en cada push a main
- ✅ Caché inteligente en edge locations
- ✅ Alta disponibilidad y escalabilidad

---

## 🛠️ Prerequisitos

### 1. Herramientas necesarias

- **Terraform** >= 1.0
  ```bash
  # Windows (con Chocolatey)
  choco install terraform
  
  # macOS (con Homebrew)
  brew install terraform
  
  # Verificar instalación
  terraform --version
  ```

- **AWS CLI** >= 2.0
  ```bash
  # Windows
  msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
  
  # macOS
  brew install awscli
  
  # Verificar instalación
  aws --version
  ```

- **Cuenta de AWS** con permisos de administrador

### 2. Configurar AWS CLI

```bash
# Configurar credenciales
aws configure

# Ingresa:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

Para obtener las credenciales de AWS:
1. Inicia sesión en [AWS Console](https://console.aws.amazon.com)
2. Ve a IAM → Users → Tu usuario
3. Security credentials → Create access key
4. Guarda el Access Key ID y Secret Access Key

---

## 🚀 Paso 1: Desplegar Infraestructura con Terraform

### 1.1. Configurar variables

```bash
cd terraform

# Copiar archivo de ejemplo
cp terraform.tfvars.example terraform.tfvars

# Editar terraform.tfvars
# Reemplaza "my-profile-frontend-12345" con un nombre ÚNICO globalmente
```

**terraform.tfvars:**
```hcl
bucket_name = "tu-nombre-unico-123456"  # DEBE SER ÚNICO EN TODO AWS
aws_region  = "us-east-1"
environment = "production"
```

⚠️ **Importante**: El nombre del bucket S3 debe ser único en todo AWS. Si obtienes un error, intenta con otro nombre.

### 1.2. Inicializar Terraform

```bash
terraform init
```

Esto descarga los providers de AWS necesarios.

### 1.3. Ver el plan de ejecución

```bash
terraform plan
```

Revisa los recursos que se crearán:
- 1 S3 Bucket
- 1 S3 Bucket Policy
- 1 S3 Website Configuration
- 1 CloudFront Distribution
- 1 CloudFront Origin Access Control

### 1.4. Aplicar la infraestructura

```bash
terraform apply
```

Escribe `yes` cuando se te pregunte. Este proceso toma ~5-10 minutos (CloudFront es lento).

### 1.5. Guardar los outputs

Al finalizar, Terraform mostrará:
```
Outputs:

cloudfront_distribution_id = "E1234ABCDEFGH"
cloudfront_domain_name = "d1234abcdefgh.cloudfront.net"
s3_bucket_name = "tu-nombre-unico-123456"
website_url = "https://d1234abcdefgh.cloudfront.net"
```

**Guarda estos valores**, los necesitarás para GitHub Actions.

---

## 🔧 Paso 2: Configurar GitHub Actions

### 2.1. Crear usuario IAM para GitHub Actions

En AWS Console:

1. Ve a **IAM → Users → Create user**
2. Nombre: `github-actions-deployer`
3. No marcar "Provide user access to AWS Management Console"
4. Click **Next**
5. En Permissions, selecciona **Attach policies directly**
6. Busca y selecciona:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
7. Click **Create user**
8. Entra al usuario creado
9. **Security credentials** → **Create access key**
10. Selecciona "Command Line Interface (CLI)"
11. **Guarda** el Access Key ID y Secret Access Key

### 2.2. Configurar GitHub Secrets

En tu repositorio de GitHub:

1. Ve a **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Crea estos 4 secrets:

| Name | Value |
|------|-------|
| `AWS_ACCESS_KEY_ID` | Access Key del usuario IAM |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key del usuario IAM |
| `S3_BUCKET_NAME` | Nombre del bucket S3 (de terraform output) |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de CloudFront (de terraform output) |

---

## 📦 Paso 3: Desplegar la Aplicación

### 3.1. Verificar configuración de build

Asegúrate de que `angular.json` tenga la configuración de producción correcta:

```json
{
  "projects": {
    "my-profile": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "outputPath": "dist/my-profile/browser",
              "optimization": true,
              "sourceMap": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

### 3.2. Hacer push a main

```bash
git add .
git commit -m "feat: add AWS deployment infrastructure"
git push origin main
```

Esto disparará automáticamente GitHub Actions.

### 3.3. Monitorear el despliegue

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás el workflow "Deploy to AWS S3" ejecutándose
4. Click en el workflow para ver los logs en tiempo real

El proceso toma ~3-5 minutos:
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies
- ✅ Build production
- ✅ Configure AWS credentials
- ✅ Deploy to S3
- ✅ Invalidate CloudFront cache

### 3.4. Acceder a tu aplicación

Una vez completado, tu app estará disponible en:
```
https://{tu-cloudfront-domain}.cloudfront.net
```

Obtén la URL exacta con:
```bash
cd terraform
terraform output website_url
```

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas push a `main`:

1. GitHub Actions se ejecuta automáticamente
2. Construye la aplicación con `npm run build`
3. Sube los archivos a S3
4. Invalida el caché de CloudFront
5. Los cambios se propagan en ~1-2 minutos

No necesitas volver a ejecutar Terraform a menos que cambies la infraestructura.

---

## 🧪 Despliegue Manual (Opcional)

Si prefieres desplegar manualmente sin GitHub Actions:

```bash
# 1. Construir la aplicación
npm run build

# 2. Subir a S3
aws s3 sync dist/my-profile/browser/ s3://tu-bucket-name --delete

# 3. Invalidar caché de CloudFront
aws cloudfront create-invalidation \
  --distribution-id TU_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🗑️ Destruir Infraestructura

Si quieres eliminar todos los recursos de AWS:

```bash
cd terraform

# Ver qué se eliminará
terraform plan -destroy

# Eliminar todo
terraform destroy
```

⚠️ **Advertencia**: Esto eliminará permanentemente:
- El bucket S3 y todos sus archivos
- La distribución de CloudFront
- Todos los logs y configuraciones

---

## 💰 Costos Estimados

Con el **Free Tier de AWS** (12 meses):

| Servicio | Free Tier | Costo después del Free Tier |
|----------|-----------|----------------------------|
| S3 | 5GB de almacenamiento | ~$0.023/GB/mes |
| S3 Requests | 20,000 GET, 2,000 PUT | $0.0004/1000 GET |
| CloudFront | 1TB de transferencia | $0.085/GB |
| Total estimado/mes | **$0** | **$1-5** (tráfico moderado) |

**Para un sitio con ~1000 visitas/mes**: Casi gratis (< $1/mes)

---

## 🐛 Troubleshooting

### Error: "BucketAlreadyExists"
El nombre del bucket ya está tomado. Cambia `bucket_name` en `terraform.tfvars`.

### Error: 403 Forbidden en CloudFront
Espera 10-15 minutos. CloudFront tarda en propagarse globalmente.

### Error: "AccessDenied" en GitHub Actions
Verifica que los secrets estén correctamente configurados y que el usuario IAM tenga los permisos necesarios.

### Los cambios no se reflejan
1. Verifica que GitHub Actions se ejecutó exitosamente
2. Limpia el caché de tu navegador (Ctrl+Shift+R)
3. Espera 1-2 minutos para la propagación de CloudFront

### Error en el routing de Angular
Asegúrate de que CloudFront tenga configurado el custom error response para 404 → /index.html (ya incluido en Terraform).

---

## 📚 Recursos Adicionales

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions AWS](https://github.com/aws-actions)

---

## 📝 Checklist de Despliegue

- [ ] Terraform instalado y configurado
- [ ] AWS CLI configurado con credenciales
- [ ] `terraform.tfvars` creado con nombre único de bucket
- [ ] `terraform apply` ejecutado exitosamente
- [ ] Outputs de Terraform guardados
- [ ] Usuario IAM creado para GitHub Actions
- [ ] 4 secrets configurados en GitHub
- [ ] Push a main realizado
- [ ] GitHub Actions ejecutado exitosamente
- [ ] Aplicación accesible en CloudFront URL

---

**¡Listo! Tu aplicación Angular está desplegada en AWS con CI/CD automático.** 🚀
