# 加多宝挑码助手 PRO - 本地部署与打包指南

本指南将帮助您将此网页应用部署到您的电脑上，并将其打包为可直接运行的 `.exe` 软件。

## 第一阶段：环境准备

在开始之前，您需要安装 Node.js 环境。

1.  **下载 Node.js**:
    *   访问官网 [https://nodejs.org/](https://nodejs.org/)。
    *   下载左边的 **LTS 版本** (长期支持版)。
    *   双击安装包，一路点击 "Next" 完成安装。

2.  **验证安装**:
    *   按键盘 `Win + R`，输入 `cmd` 并回车。
    *   在黑窗口输入 `node -v`，如果出现版本号（如 v18.x.x），说明安装成功。

---

## 第二阶段：创建项目

1.  在电脑桌面上新建一个文件夹，命名为 `JDB_Lottery`。
2.  进入该文件夹，在地址栏输入 `cmd` 并回车，打开命令窗口。
3.  **初始化项目** (复制以下命令并回车，需要联网):
    ```bash
    npx create-react-app my-app --template typescript
    ```
    *(这一步可能需要几分钟，请耐心等待)*

4.  **进入项目目录**:
    ```bash
    cd my-app
    ```

5.  **安装图标库**:
    ```bash
    npm install lucide-react
    ```

---

## 第三阶段：复制代码

现在，您需要用我提供的代码替换项目中的默认代码。

1.  打开文件夹 `JDB_Lottery\my-app`。
2.  **替换 public/index.html**:
    *   找到 `public` 文件夹下的 `index.html`。
    *   用我提供的 `index.html` 代码**完全覆盖**它。
    *   **关键步骤**: 在本地运行时，请删除 `index.html` 代码中 `<script type="importmap">...</script>` 这一整段，因为本地环境不需要它。但请**保留** `<script src="https://cdn.tailwindcss.com"></script>`。

3.  **替换 src 文件夹内容**:
    *   删除 `src` 文件夹下的所有文件。
    *   新建 `types.ts`, `constants.ts`, `App.tsx`, `index.tsx` 并填入对应代码。
    *   在 `src` 下新建 `components` 文件夹，并新建 `Header.tsx`, `BallGrid.tsx`, `ControlPanel.tsx` 填入代码。
    *   在 `src` 下新建 `utils` 文件夹，并新建 `api.ts`, `lotteryLogic.ts` 填入代码。

---

## 第四阶段：本地试运行

1.  在 `my-app` 文件夹的命令窗口中输入：
    ```bash
    npm start
    ```
2.  如果一切顺利，浏览器会自动打开 `http://localhost:3000`，您应该能看到软件界面了。
3.  确认功能正常后，按 `Ctrl + C` 停止运行。

---

## 第五阶段：打包成 EXE 文件

为了方便使用，我们可以把它打包成一个独立的 `.exe` 程序。

1.  **安装打包工具 Nativefier** (全局安装):
    ```bash
    npm install -g nativefier
    ```

2.  **开始打包**:
    *   首先确保您的项目正在运行 (即在另一个窗口执行了 `npm start`)。
    *   在新的命令窗口中输入以下命令：
    ```bash
    nativefier "http://localhost:3000" --name "加多宝挑码助手PRO" --platform windows --arch x64 --single-instance --tray
    ```

3.  **获取软件**:
    *   命令完成后，文件夹内会出现一个名为 `加多宝挑码助手PRO-win32-x64` 的文件夹。
    *   打开它，找到 `加多宝挑码助手PRO.exe`。
    *   您可以右键 -> 发送到 -> 桌面快捷方式。
    *   以后直接双击这个图标即可运行，无需再打开浏览器！

---

### 常见问题排查

*   **Q: 打开软件显示空白？**
    *   A: 请检查 `public/index.html` 中是否删除了 `importmap` 代码段，但保留了 `tailwindcss` 的引用。

*   **Q: 开奖记录一直显示 "暂无数据"？**
    *   A: 这是由于浏览器的跨域安全策略 (CORS)。
    *   **解决方法**: 打包成 EXE 后通常能自动解决。如果是在浏览器中运行，您可以尝试安装 "Allow CORS" 插件，或者等待几秒钟，软件会自动尝试使用代理服务器获取数据。

*   **Q: 界面排版乱了？**
    *   A: 请确保电脑联网，因为样式库 (Tailwind CSS) 是通过网络加载的。
