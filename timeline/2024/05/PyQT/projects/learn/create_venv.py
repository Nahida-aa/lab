import os
import sys
import subprocess

# 检查Python版本
print(sys.version)

# 检查当前目录
print(os.getcwd())

# 尝试创建虚拟环境
try:
    subprocess.run(["py11", "-m", "venv", ".venv"], check=True)
except subprocess.CalledProcessError as e:
    print(f"创建虚拟环境失败: {e}")