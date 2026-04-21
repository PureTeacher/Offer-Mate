/**
 * 全局主题管理 - 使用 Vue 响应式系统
 */

import Vue from 'vue'

class ThemeManager {
  constructor() {
    // 使用 Vue.observable 使状态响应式
    this.state = Vue.observable({
      currentTheme: 'light',
      currentFontSize: 'medium',
    });
    this.listeners = [];
    this.init();
  }

  init() {
    try {
      const settings = uni.getStorageSync('userSettings');
      if (settings) {
        this.state.currentTheme = settings.theme || 'light';
        this.state.currentFontSize = settings.fontSize || 'medium';
      }
    } catch (e) {
      console.error('加载主题设置出错', e);
    }
  }

  /**
   * 获取当前主题
   */
  getTheme() {
    return this.state.currentTheme;
  }

  /**
   * 获取当前字体大小
   */
  getFontSize() {
    return this.state.currentFontSize;
  }

  /**
   * 设置主题并通知所有监听者
   */
  setTheme(theme) {
    if (this.state.currentTheme !== theme) {
      this.state.currentTheme = theme;
      this.updateSettings();
      this.notifyListeners();
    }
  }

  /**
   * 设置字体大小并通知所有监听者
   */
  setFontSize(fontSize) {
    if (this.state.currentFontSize !== fontSize) {
      this.state.currentFontSize = fontSize;
      this.updateSettings();
      this.notifyListeners();
    }
  }

  /**
   * 更新本地存储
   */
  updateSettings() {
    try {
      const settings = uni.getStorageSync('userSettings') || {};
      settings.theme = this.state.currentTheme;
      settings.fontSize = this.state.currentFontSize;
      uni.setStorageSync('userSettings', settings);
    } catch (e) {
      console.error('保存主题设置出错', e);
    }
  }

  /**
   * 添加监听者
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * 通知所有监听者
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          theme: this.state.currentTheme,
          fontSize: this.state.currentFontSize,
        });
      } catch (e) {
        console.error('通知监听者出错', e);
      }
    });
  }

  /**
   * 获取主题配置
   */
  getThemeConfig() {
    const themes = {
      light: {
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
        sectionBackground: '#ffffff',
        borderColor: '#f0f0f0',
        descColor: '#999999',
        navBackground: '#667eea',
        navText: '#ffffff',
      },
      dark: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        sectionBackground: '#2d2d2d',
        borderColor: '#444444',
        descColor: '#aaaaaa',
        navBackground: '#1a1a1a',
        navText: '#ffffff',
      },
      auto: {
        // 由浅色主题作为默认
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
        sectionBackground: '#ffffff',
        borderColor: '#f0f0f0',
        descColor: '#999999',
        navBackground: '#667eea',
        navText: '#ffffff',
      },
    };

    return themes[this.state.currentTheme] || themes.light;
  }
}

// 全局单例
const themeManager = new ThemeManager();

export default themeManager;
