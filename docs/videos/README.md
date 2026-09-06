# Vídeos

## Busca assistida: catálogo tradicional × linguagem natural

- Arquivo final: `busca-assistida-comparativo.mp4`
- Resolução: 1280 × 720
- Áudio: não possui
- Duração aproximada: 30 segundos
- Gerador dos quadros: `scripts/create-search-comparison-video.mjs`

O exemplo de catálogo tradicional é uma representação conceitual baseada nos grupos
de filtros observados publicamente no catálogo da Decathlon Brasil:

- https://www.decathlon.com.br/collection?q=881

A interface externa não foi copiada. O vídeo usa uma composição visual própria para
explicar a diferença entre uma jornada com vários filtros e a busca assistida.

### Imagens dos produtos

As fotografias foram obtidas no Unsplash e são usadas conforme a Unsplash License:

- Tênis vermelho — REVOLT: https://unsplash.com/photos/164_6wVEHfI
- Tênis verde: https://unsplash.com/photos/4F5O6-3uUmE
- Vans azul — Artiom Vallat: https://unsplash.com/photos/JwdWp_CZEjI
- Tênis cinza — CHUTTERSNAP: https://unsplash.com/photos/AWCZhfdIq8c
- Tênis amarelo — Sneep Crew: https://unsplash.com/photos/4ydcFIYbTFQ
- Nike colorido — Derrick Payton: https://unsplash.com/photos/d49dKAJEOP4

Os arquivos locais ficam em `docs/videos/assets/`.

Para regerar os quadros:

```bash
node scripts/create-search-comparison-video.mjs
```

Em seguida, gere o MP4 usando FFmpeg a partir de
`docs/videos/busca-assistida/timeline.txt`.

```bash
docker run --rm \
  -v "$(pwd)/docs/videos:/work" \
  -w /work/busca-assistida \
  jrottenberg/ffmpeg:6.1-alpine \
  -f concat -safe 0 -i timeline.txt \
  -vf fps=30,format=yuv420p \
  -movflags +faststart -an -y \
  ../busca-assistida-comparativo.mp4
```
