# init

## 1创建虚拟环境

Ctrl + Shift + p

-> python create environment

![image-20240302031627365](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302031627365.png)

### 1.2创建终端验证环境

Ctrl + Shift + p

-> python create terminal

![image-20240302031614211](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302031614211.png)

#### 1.2.1启动环境

```cmd
.venv\Scripts\activate
```

检查

```cmd
pip list
```

### 1.3安装PyQt

```cmd
pip install PyQt6
```

#### 1.3.2测试

/main.py

```py
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget

if __name__ == "__main__":
    print("Hello World")
```

```cmd
python main.py
```

#### 1.3.3安装pyqt6-tools

```cmd
pip install pyqt6-tools
```

### 1.4配置外部工具

#### 1.4.1QTDesigner

QTDesigner是QT界面设计器

##### 1.4.1.1pychram

打开Pycharm -> Settings -> Tools -> External Tools

点击 '+'，创建工具

![image-20240302043313847](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302043313847.png)



#### 1.4.2PYUIC

PYUIC是用于将designer生成的ui文件转换成py文件

##### 1.4.2.1pycharm

再点击 '+'，创建工具

```md
program填python.exe路径
arguments填: -m PyQt6.uic.pyuic $FileName$ -o $FileNameWithoutExtension$.py  #即将.ui变成.py
working directory填：$FileDir$
```

![image-20240302044207142](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302044207142.png)

点'Apply'这样扩展工具里面就有这两个工具。

#### 1.4.3验证

##### 14.3.1pycharm

是否成功Tools -> QTDesigner 打开设计器

![image-20240302044532479](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302044532479.png)

![image-20240302044619557](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302044619557.png)

选Widget，创建，在拖一个按钮进去

![image-20240302045242859](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302045242859.png)

测试另外一个工具

![image-20240302045624539](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302045624539.png)

![image-20240302045717188](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240302045717188.png)

生成了test.py

```py
from PyQt6 import QtCore, QtGui, QtWidgets


class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(400, 300)
        self.pyqt6_pushButton = QtWidgets.QPushButton(parent=Form)
        self.pyqt6_pushButton.setGeometry(QtCore.QRect(90, 70, 75, 24))
        self.pyqt6_pushButton.setObjectName("pyqt6_pushButton")

        self.retranslateUi(Form)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.pyqt6_pushButton.setText(_translate("Form", "text_PushButton"))
```

## 2第一个程序

