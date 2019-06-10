> 相关参数如下说明：

```
    "-dQUIET",    安静的意思，指代执行过程中尽可能少的输出日志等信息。（也可以简写为“-q”）
    "-dNOSAFER",    通过命令行运行
    "-dBATCH",    执行到最后一页后退出
    "-dNOPAUSE",    每一页转换之间没有停顿
    "-dNOPROMPT",    没有相关提示                       
    "-dFirstPage=1",    从第几页开始
    "-dLastPage=5",     到第几页结束  
    "-sDEVICE=pngalpha",    转换输出的文件类型装置，默认值为x11alpha
    "-g720x1280",    图片像素(-g<width>x<height>)，一般不指定，使用默认输出
    "-r300",    图片分辨率（即图片解析度为300dpi），默认值好像是72(未测试证实)
    "-sOutputFile=/opt/shanhy/error1png/%d.png",    图片输出路径，使用%d或%ld输出页数
```

> demo：

```
gswin32c.exe -q -dNOSAFER -dBATCH -dNOPAUSE -dNOPROMPT -dFirstPage=1 -dLastPage=2  -r150 -sDEVICE=pngalpha  -sOutputFile=H:/1/%d.png "H:/1/教材解读-人教英语必修2 Unit 5 Music.pdf"
```

> 资料：https://www.ghostscript.com/doc/current/Use.htm
