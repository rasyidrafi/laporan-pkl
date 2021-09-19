$("#list-init").on("input", function(e) {
    var inputVal = $(this).val();
    if (inputVal.includes("\n")) {
        inputVal = inputVal.split("\n")
    }
    if (inputVal instanceof Array) {
        var optionTemp = '';
        inputVal.forEach(name => {
            optionTemp += `
            <option value="${name}">${name}</option>
            `
        });
        $("#select2-container").html(`
        <select name="penyusun" id="penyusun" class="form-select" multiple required>
            ${optionTemp}
        </select>
        `);
        NioApp.Select2('.form-select');
    }
});