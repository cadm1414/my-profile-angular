Servicios usados:
- S3 para hosting estático
- CloudFront para CDN global + HTTPS
- GitHub Actions para CI/CD del frontend

Diseño:
GitHub → GitHub Actions → S3 → CloudFront → Usuarios

Ventajas:
- Súper económico
- HTTPS automático
- Distribución global con baja latencia
- Deploy automático por push
