define(['base/js/namespace', 'jquery'], function(Jupyter, $) {
    // Add FontAwesome CDN link to the document head for icons (if not already added)
    if (!$('link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"]').length) {
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">');
    }

    // =================== Floating Run Button (existing code) ===================
    var floatButton = $('<button/>', {
        id: 'float-run-btn',
        html: '<i class="fa fa-play"></i> Run',
        style: `
            position: absolute;
            z-index: 1000;
            background-color: #2f2f2f;
            color: white;
            border: none;
            padding: 0px 8px;
            cursor: pointer;
            border-radius: 5px;
            border: 2px solid #a6e22e;
            display: none;
            font-size: 14px;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.2);
        `
    }).appendTo('body');

    floatButton.on('mouseenter', function() {
        $(this).css({
            'background-color': '#a6e22e',
            'color': 'black'
        });
    }).on('mouseleave', function() {
        $(this).css({
            'background-color': '#2f2f2f',
            'color': 'white'
        });
    });

    // Display on right
    // function positionFloatButton() {
    //     var selectedCell = Jupyter.notebook.get_selected_cell().element;
    //     var position = selectedCell.offset();

    //     floatButton.css({
    //         top: position.top + 5 + 'px',
    //         left: position.left + selectedCell.width() + 10 + 'px',
    //         display: 'block'
    //     });
    // }

    // Display on left
    function positionFloatButton() {
        var selectedCell = Jupyter.notebook.get_selected_cell().element;
        var position = selectedCell.offset();
    
        // Set the button position to the left of the selected cell
        floatButton.css({
            top: position.top + 5 + 'px',       // Keep it slightly above the cell's top
            left: position.left - floatButton.outerWidth() - 10 + 'px', // Place it on the left of the cell
            display: 'block'                    // Make it visible
        });
    }
    
    function runAndMoveToNextCell() {
        Jupyter.notebook.execute_cell();
        if (Jupyter.notebook.get_selected_index() < Jupyter.notebook.ncells() - 1) {
            Jupyter.notebook.select_next();
            positionFloatButton();
        }
    }

    Jupyter.notebook.events.on('select.Cell', function() {
        positionFloatButton();
    });

    floatButton.on('click', function() {
        runAndMoveToNextCell();
    });

    positionFloatButton();

    // =================== Delete Cell Button in Toolbar ===================

    function addDeleteCellButton() {
        // Check if toolbar is available and if button doesn't already exist
        if (Jupyter.toolbar && $('#delete-cell-btn').length === 0) {
            Jupyter.toolbar.add_buttons_group([{
                'label': '',
                'icon': 'fa-trash-o fa',
                'callback': function() {
                    // Delete the currently selected cell
                    Jupyter.notebook.delete_cell();
                },
                'id': 'delete-cell-btn'
            }]);

            // Add some basic styling to the delete button
            $('#delete-cell-btn').css({
                'background-color': '#e74c3c',
                'color': 'white',
                'border-radius': '3px',
                'border': '2px solid rgb(231, 76, 60)'
            });
        }
    }

    // Add the delete button when the notebook is fully loaded
    function loadDeleteCellButton() {
        // Wait for the toolbar to initialize and add the button
        if (Jupyter.toolbar) {
            addDeleteCellButton();
        } else {
            // In case the toolbar is not ready, wait for it
            $([Jupyter.events]).on('app_initialized.NotebookApp', addDeleteCellButton);
        }
    }

    // Trigger the addition of the delete button
    loadDeleteCellButton();

    // Function to add toggle collapse button and header to each cell
    function addToggleCollapseButton(cell) {
        // Check if the button and header already exist
        if (!cell.element.find('.toggle-collapse-btn').length && !cell.element.find('.cell-header').length) {

            // Create the header that will be always visible
            var header = $('<div/>', {
                class: 'cell-header',
                style: `
                    background-color: #2f2f2f;
                    padding: 0 5px;
                    border-left: 5px solid #1C3401;
                    margin-bottom: 0px;
                    font-weight: bold;
                    color: #333;
                    display: flex;
                    align-items: center;
                `
            });

            // Add content to the header (type of cell and preview)
            var cellType = cell.cell_type === 'code' ? 'Code Cell' : 'Markdown Cell';
            var cellSummary = '';
            if (cell.cell_type === 'code') {
                cellSummary = cell.get_text().split('\n')[0];  // Show first line of code
            } else if (cell.cell_type === 'markdown') {
                cellSummary = cell.get_text().split('\n')[0];  // Show first line of markdown
            }

            header.html(`<span></span>`);

            // Create the toggle collapse button
            var toggleButton = $('<button/>', {
                class: 'toggle-collapse-btn',
                html: '<i class="fa fa-chevron-up"></i>', // FontAwesome icon for collapse/expand
                style: `
                    background-color: #2f2f2f;
                    color: white;
                    border: none;
                    cursor: pointer;
                    margin-left: auto;
                    border-radius: 3px;
                    font-size: 5px;
                    margin: 0 0 0 auto;
                    padding: 0;
                    height: 20px;
                `
            });

            // Add the header and the toggle button
            header.append(toggleButton);
            cell.element.prepend(header);  // Add header at the top of the cell

            // Toggle input and output areas when the button is clicked
            toggleButton.on('click', function() {
                var icon = $(this).find('i'); // Get the icon element

                // Toggle the cell's input area (hide/show)
                cell.element.find('.input').toggle();

                // Toggle the cell's output area (hide/show)
                cell.element.find('.output_wrapper').toggle();

                // Change the icon based on visibility of the input/output area
                if (cell.element.find('.input').is(':visible') || cell.element.find('.output_wrapper').is(':visible')) {
                    icon.removeClass('fa-chevron-down').addClass('fa-chevron-up'); // Expanded
                } else {
                    icon.removeClass('fa-chevron-up').addClass('fa-chevron-down'); // Collapsed
                }
            });
        }
    }

    // Apply the toggle button and header to all existing cells
    Jupyter.notebook.get_cells().forEach(function(cell) {
        addToggleCollapseButton(cell);
    });

    // Add the button and header to any new cells created
    Jupyter.notebook.events.on('create.Cell', function(event, data) {
        addToggleCollapseButton(data.cell);
    });

    // Ensure the button and header are added when the notebook is fully loaded
    Jupyter.notebook.events.on('notebook_loaded.Notebook', function() {
        Jupyter.notebook.get_cells().forEach(function(cell) {
            addToggleCollapseButton(cell);
        });
    });
});
