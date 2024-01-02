<select
    className={"rounded m-2 text-gray-700 p-2"}
onChange={(e) => {
    console.log(e.currentTarget.value);
    setComPort(e.currentTarget.value);
}}
>
{comPorts.map((port) => (
    <option className={"text-gray-700"} key={port} value={port}>{port}</option>
))}
</select>