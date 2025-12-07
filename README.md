# 加多宝挑码助手 PRO - 安装与运行指南

本指南将帮助您在本地电脑上部署运行该软件，并将其打包为 Windows 可执行文件 (.exe)。

## 第一步：准备环境

1.  **下载并安装 Node.js**
    *   访问 [Node.js 官网](https://nodejs.org/) 下载 "LTS (长期支持版)" 并安装。
    *   安装完成后，按 `Win + R`，输入 `cmd` 打开命令提示符，输入 `node -v`，如果有版本号显示，说明安装成功。

## 第二步：创建项目

1.  在您的电脑上新建一个文件夹，例如命名为 `lottery-pro`。
2.  进入该文件夹，在地址栏输入 `cmd` 并回车，打开黑色的命令窗口。
3.  输入以下命令初始化一个 React 项目（需要联网）：
    ```bash
    npx create-react-app my-app --template typescript
    ```
    *(耐心等待安装完成)*

4.  安装完成后，进入项目目录：
    ```bash
    cd my-app
    ```

5.  安装图标库依赖：
    ```bash
    npm install lucide-react
    ```

## 第三步：部署代码

您需要将提供的代码文件复制到 `my-app` 项目的对应位置中。

1.  **打开项目文件夹** (`lottery-pro/my-app`)。
2.  **替换/新建文件**：

    *   **public/index.html**:
        *   用提供的 `index.html` 内容覆盖。
        *   **注意**: 请删除 `index.html` 中 `<script type="importmap">...</script>` 这一整段代码，因为本地环境使用 npm 安装依赖，不需要 importmap。保留 Tailwind CSS 的 CDN 链接。

    *   **src/App.tsx**:
        *   用提供的 `App.tsx` 内容覆盖。

    *   **src/index.tsx**:
        *   用提供的 `index.tsx` 内容覆盖。

    *   **src/types.ts**:
        *   在 `src` 文件夹下新建 `types.ts`，粘贴对应内容。

    *   **src/constants.ts**:
        *   在 `src` 文件夹下新建 `constants.ts`，粘贴对应内容。

    *   **新建 src/components 文件夹**:
        *   新建 `src/components/Header.tsx`
        *   新建 `src/components/BallGrid.tsx`
        *   新建 `src/components/ControlPanel.tsx`
        *   分别填入对应代码。

    *   **新建 src/utils 文件夹**:
        *   新建 `src/utils/lotteryLogic.ts`
        *   新建 `src/utils/api.ts`
        *   分别填入对应代码。

## 第四步：本地运行

1.  在 `my-app` 文件夹的命令窗口中输入：
    ```bash
    npm start
    ```
2.  浏览器会自动打开 `http://localhost:3000`，您现在应该能看到软件正常运行了。

## 第五步：打包成 EXE (Windows 软件)

如果您想把它变成一个可以直接双击运行的 `.exe` 文件：

1.  **安装打包工具 Nativefier** (在命令窗口输入)：
    ```bash
    npm install -g nativefier
    ```

2.  **生成 EXE**:
    *   确保您的网页还在运行 (即 `http://localhost:3000` 可访问)。
    *   打开一个新的命令窗口，输入以下命令：
    ```bash
    nativefier "http://localhost:3000" --name "JDB_Lottery_Pro" --platform windows --arch x64
    ```

3.  **完成**:
    *   命令执行完毕后，文件夹内会生成一个名为 `JDB_Lottery_Pro-win32-x64` 的文件夹。
    *   打开它，找到 `JDB_Lottery_Pro.exe`，双击即可运行！

---

### 常见问题

*   **开奖记录查不到？**
    *   本地运行时，浏览器可能会拦截跨域请求 (CORS)。我在代码中已经添加了代理功能，通常可以解决。如果仍然不行，请尝试安装 Chrome 插件 "Allow CORS" 临时解决，或者直接使用打包后的 EXE 运行，EXE 环境通常限制较少。

*   **界面样式错乱？**
    *   请确保 `public/index.html` 中保留了 Tailwind CSS 的 `<script src="https://cdn.tailwindcss.com"></script>` 引用。
