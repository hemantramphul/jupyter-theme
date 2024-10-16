## Jupyter Custom Theme Setup

This guide provides instructions on how to install and apply custom themes for Jupyter Notebooks using the `jupyterthemes` package.

## Installation

1. **Install the `jupyterthemes` package:**

   First, you need to install the `jupyterthemes` package. You can do this directly in a Jupyter Notebook by running:

   ```bash
   !pip install jupyterthemes
   ```

2. **Enable a Dark Theme:**

   After installation, you can apply a dark theme (such as `monokai`) with the following command inside your notebook:

   ```python
   import jupyterthemes as jt
   jt -t monokai
   ```

## Customization

If you wish to use this theme consistently, copy and paste the `custom.css` file into your repository:

- Navigate to the folder:

  ```
  C:\Users\<username>\.jupyter\custom
  ```

- Place the `custom.css` file here for persistent customization.

## Resetting to Default Theme

To reset the theme to the default, run the following command:

```bash
jt -r
```

This will revert Jupyter to the original theme settings.
