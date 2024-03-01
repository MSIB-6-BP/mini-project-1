# Monitor Parameter Lingkungan
Aplikasi sederhana yang bisa digunakan untuk memonitor parameter-parameter yang ada pada sebuah lingkungan misal: kadar CO2, Kelembapan, Temperatur, dan Intensitas cahaya matahari.

## Fitur
Ada 3 fitur utama pada aplikasi ini yaitu
- Low couple antara client dan server dimana kita bisa menentukan situs manakah yang ingin kita monitor
- Monitor parameter lingkungan menggunakan websocket sehingga data dapat dibaca secara realtime
- Query message yang bisa digunakan untuk mendapatkan data dan mengirimkan perintah pada situs yang terhubung

## Teknologi
Projek ini dibagi menjadi 2 bagian yaitu frontend dan backend.

Teknologi yang digunakan pada frontend antara lain:
- vite
- reactjs
- socket.io (client)
- chartjs
- tailwindcss

Teknologi yang digunakan pada backend antara lain:
- express
- socket.io

## Cara menjalankan
- Client dijalankan seperti aplikasi vite pada umumnya dengan ```npm install``` + ```npm run start```
- Server dapat dijalankan dengan ```npm install``` dan menjalankan file index.js dengan ```node index.js```
