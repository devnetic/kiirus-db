import { usage } from '@devnetic/cli'

const help = () => {
  usage('Usage: $0 [options]')
    .option(['-p', '--port'], '\t\tPort to use [3000]')
    .option(['-H', '--host'], '\t\tAddress to use [0.0.0.0]')
    .option(['-s', '--silent'], '\tSuppress log messages from output')
    .option(['-h', '--help'], '\t\tPrint this list and exit.')
    .epilog(`Kiirus-DB package copyright ${new Date().getFullYear()}`)
    .show()
}

export default help
