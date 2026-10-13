#!/usr/bin/env python3
"""Padroniza foto de peça: remove fundo (rembg), recorta e centraliza em PNG quadrado transparente.
Uso: python3 tools/padronizar.py <entrada> <saida.png> [--tamanho 1000] [--ocupar 0.8] [--sem-rembg]"""
import argparse, subprocess, tempfile, os
from PIL import Image
ap = argparse.ArgumentParser()
ap.add_argument('entrada'); ap.add_argument('saida')
ap.add_argument('--tamanho', type=int, default=1000)
ap.add_argument('--ocupar', type=float, default=0.8)
ap.add_argument('--sem-rembg', action='store_true', help='pular remoção de fundo (imagem já transparente)')
a = ap.parse_args()
src = a.entrada
if not a.sem_rembg:
    tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name
    subprocess.run([os.path.expanduser('/home/box/bin/rembg'), 'i', src, tmp], check=True)
    src = tmp
im = Image.open(src).convert('RGBA')
alpha = im.split()[3].point(lambda v: 255 if v > 20 else 0)
bbox = alpha.getbbox()
if not bbox: raise SystemExit('imagem vazia após remover fundo')
im = im.crop(bbox)
alvo = int(a.tamanho * a.ocupar)
esc = alvo / max(im.size)
im = im.resize((max(1, round(im.width*esc)), max(1, round(im.height*esc))), Image.LANCZOS)
out = Image.new('RGBA', (a.tamanho, a.tamanho), (0,0,0,0))
out.paste(im, ((a.tamanho-im.width)//2, (a.tamanho-im.height)//2), im)
out.save(a.saida, optimize=True)
print(f'{a.saida}: {a.tamanho}x{a.tamanho}, objeto {im.width}x{im.height}')
