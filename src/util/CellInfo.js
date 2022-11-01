export default class CellInfo {
    row = null;
    headerItem = null;
    rowIndex = null;
    colIndex = null;
    originRow = null;
    rowChecked = null;
    constructor(headerItem, row, rowIndex, colIndex = null, rowChecked) {
        this.row = row;
        this.headerItem = headerItem;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.originRow = row.__originRow;

        this.rowChecked = rowChecked !== undefined ? rowChecked : (row.__rowSelect === true);
        // this.rowChecked = rowChecked;
    }
    getHeaderItem() {
        return this.headerItem;
    }
    getHeaderKey() {
        // console.log('getHeaderKey', this.headerItem)
        return this.headerItem ? this.headerItem.key : '';
    }
    getRowIndex() {
        return this.rowIndex;
    }
    getColIndex() {
        return this.colIndex;
    }
    getRow() {
        return this.row;
    }
    getOriginRow() {
        // console.log('getOriginRow', this.originRow);
        return this.originRow;
    }
    getCellValue() {
        return this.row[this.headerItem.key];
    }
    getRowChecked() {
        return this.rowChecked;
    }
    setRowChecked(checked) {
        this.rowChecked = checked;
    }
}