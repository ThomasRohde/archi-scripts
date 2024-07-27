/**
 * @module commonStyles
 * @description Provides common CSS styles with minimal vertical spacing for JArchi script documentation and tutorials.
 */

const commonStyles = `
<style>
    body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.3;
        color: #333;
        margin: 0;
        padding: 10px;
    }
    h1 {
        color: #2c3e50;
        font-size: 20px;
        margin: 10px 0 5px 0;
    }
    h2 {
        color: #3498db;
        font-size: 16px;
        margin: 8px 0 4px 0;
    }
    p {
        margin: 0 0 5px 0;
    }
    ul,
    ol {
        margin: 0 0 5px 0;
        padding-left: 20px;
    }
    li {
        margin-bottom: 2px;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 5px 0;
    }
    table,
    th,
    td {
        border: 1px solid black;
        font-size: 12px;
        padding: 2px;
    }
</style>
`;

// For use in JArchi scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = commonStyles;
}

// For use in browser environment (tutorials)
if (typeof window !== 'undefined') {
    window.commonStyles = commonStyles;
}