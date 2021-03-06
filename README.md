# 劣化画像修復

## Node modules
- opencv4nodejs
- mathjs
- node-svd
- matplotnode
- fs

## 各プログラム概要

### A

以下の処理を順次行う
1. カラー画像ファイルの読み込み
1. グレースケール画像への変換
1. エッジ抽出画像の作成
1. バイキュービック法による画素補間を用いた画像拡大
1. 1~4までの結果の画面への表示
1. 4の結果のPNG形式での保存

### B

入力された2つの画像のPSNR値を求める  
(psnr.jsと同等)

### C

グレースケール画像に対して任意のPSFを畳み込むことで画像を劣化させ，保存する

以下のプログラムは特定のPSFを畳み込む仕様
- C-1.js  
	カメラのシャッター開口時間にカメラを斜めに動かした際に発生するブレのPSF
- C-2.js  
	2変数ガウス関数を核関数とするボケのPSF

### D

任意のPSFを対応する線形変換行列に変換し，画像ベクトルに対して適用・保存する

### E

Cの処理後，階調の低い方のn bitを0にした画像を作成・保存する(ボケ画像にノイズ付与を行う)  
(degrade.jsと同等)

### F

PSFを線形変換行列に変換した行列Pの一般逆を用いた修復を行う

### G

分離可能なPSFである場合の一般逆行列を用いた修復を行う

### H

TSVD法による修復を行う

### I

Tikhonovの正則化法による修復を行う

### ライブラリ

#### Dots.js

行列(2次元配列)同士の積を計算する

#### timer.js

引数として与えた関数を実行し，その実行時間を出力する

#### psf2P.js

PSFを線形変換行列Pに変換する

#### psf2P_separable.js

PSFを分離させたものを元に線形変換行列Ar,Acを求める

#### svd-inv.js

node-svdを使用して求まる特異値分解の結果resを元に，元の行列の逆行列を求める

#### matrixParseInt.js

1次元or2次元配列のすべての要素をint, uint, uint8のいずれかに変換する

### pgm2png.js

PGM形式の画像をPNG形式で保存し直す

### resize

入力画像を任意のサイズにリサイズする．

### diff.js

入力された2つの画像を比較し，完全に一致するなら'true'，不一致ならば'false'を出力する

### psf-conv.js

入力されたPSFの総和を出力する
