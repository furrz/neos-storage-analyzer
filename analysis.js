const picker = document.querySelector('#file-picker');
const initial = document.querySelector('#initial');
const output = document.querySelector('#output');

const _ = item => document.createElement(item);

HTMLElement.prototype.with = function () {
    for (let it of arguments) this.appendChild(it);
    return this;
};

HTMLElement.prototype.write = function (text) {
    this.innerText = text;
    return this;
};

HTMLElement.prototype.set = function(e) {
    e(this);
    return this;
}

const bytesToUnit = bytes => {
    if ((bytes >> 30) & 0x3FF)
        return (bytes >>> 30) + '.' + ( bytes & (3*0x3FF )) + 'GB' ;
    else if ( ( bytes >> 20 ) & 0x3FF )
        return ( bytes >>> 20 ) + '.' + ( bytes & (2*0x3FF ) ) + 'MB' ;
    else if ( ( bytes >> 10 ) & 0x3FF )
        return ( bytes >>> 10 ) + '.' + ( bytes & (0x3FF ) ) + 'KB' ;
    else
        return ( bytes >>> 1 ) + 'B' ;
};

picker.addEventListener('change', () => {
    if (picker.files.length !== 1) return;

    const reader = new FileReader();
    reader.addEventListener('load', e => {
        const records = JSON.parse(e.target.result);

        console.log(records);
        let largestRecord = null;
        for (const record of records) {
            let bytes = 0;
            for (const dbEntry of record.neosDBmanifest) {
                bytes += dbEntry.bytes;
            }

            if (largestRecord == null) largestRecord = bytes;
            console.log(record.name, bytes);

            output.appendChild(_`div`.set(e => e.className = "recRow").with(
                _`div`.set(e => e.className = "recName").write(record.name),
                _`div`.set(e => e.className = "recSize").with(
                    _`div`.set(e => e.style.width = (bytes / largestRecord * 100) + "%").write(bytesToUnit(bytes))
                )
            ));
        }

        document.body.removeChild(initial);
    });
    reader.readAsText(picker.files[0]);
}, false);
