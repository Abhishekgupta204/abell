type ServeOptions = {
  port?: number;
  ignorePlugins?: boolean;
  printIp?: boolean;
};

function serve(command: ServeOptions): void {
  console.log('Abell Serve');
  console.log('Options - ' + command);
  console.log(3 + 'nice');
}

export default serve;
