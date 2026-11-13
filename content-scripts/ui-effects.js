/**
 * 渡轮扩展 - 独立 UI 动效模块 (ui-effects.js)
 * 功能：1. 鼠标跟随紫光视差 2. 极简暗黑 Toast 提示框
 */

// ==========================================
// 一、页面交互特效（用于 options.html 设置页）
// ==========================================
function initParallaxGlow() {
    // 仅在设置页生效（检测到我们的特定 ID 才启动）
    if (!document.getElementById('douyin-changelog')) return;

    const glow = document.createElement('div');
    glow.id = 'dynamic-glow';
    glow.style.cssText = `
        position: fixed;
        width: 600px; height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 60%);
        pointer-events: none;
        z-index: 0;
        transition: transform 0.1s ease-out;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ==========================================
// 二、全局 Toast 提示框（用于抖音网页端）
// ==========================================
function showToast(message, type = 'info') {
    // 避免重复创建
    let container = document.getElementById('dulun-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'dulun-toast-container';
        container.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    
    // 颜色配置
    let borderColor = 'rgba(168, 85, 247, 0.4)'; // 默认紫
    let textColor = '#fff';
    if (type === 'success') borderColor = 'rgba(52, 199, 89, 0.6)';
    if (type === 'error') borderColor = 'rgba(255, 59, 48, 0.6)';

    // 极简暗黑风样式
    toast.style.cssText = `
        background: rgba(15, 15, 20, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: ${textColor};
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-family: -apple-system, sans-serif;
        font-weight: 500;
        border: 1px solid ${borderColor};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(168, 85, 247, 0.1);
        margin-bottom: 12px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    // 图标
    const icon = document.createElement('span');
    icon.innerText = type === 'success' ? '✓' : type === 'error' ? '✕' : '✦';
    icon.style.color = borderColor;
    
    const textNode = document.createElement('span');
    textNode.innerText = message;

    toast.appendChild(icon);
    toast.appendChild(textNode);
    container.appendChild(toast);

    // 触发动画
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // 自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 初始化
initParallaxGlow();

// 暴露给其他脚本调用（如果是通过 content.js 注入的话）
if (typeof window !== 'undefined') {
    window.DulunUI = { showToast };
}