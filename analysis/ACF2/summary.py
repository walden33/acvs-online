import os
import csv
import pandas as pd


def main():
    data_dir = 'Data/Raw/'
    parsed_dir = 'Data/Parsed/'
    out_dir = 'Data/Summary/'
    f = open(out_dir + 'Summary.csv', 'w')
    csv_writer = csv.writer(f)
    csv_writer.writerow(['sub', 'acc', 'rt', 'opt', 'mcf_rl', 'mcf_rn',
                         'mcf_rt', 'acf_rl', 'acf_rn', 'acf_rt', 'acf_opt', 'baseline_rt'])
    for sub in os.listdir(data_dir):
        if os.path.isdir(data_dir + sub):
            # ACVS
            acvs = pd.read_csv(parsed_dir + sub + '_ACVS.csv')
            acc = acvs['is_acc'].mean()
            correct = acvs[acvs['is_acc'] == 1]
            rawmeanrt = correct['rt'].mean()
            rawstdrt = correct['rt'].std()
            trimmed = correct[correct['rt'] > 300]
            trimmed = trimmed[trimmed['rt'] > rawmeanrt-3*rawstdrt]
            trimmed = trimmed[trimmed['rt'] < rawmeanrt+3*rawstdrt]
            rt = trimmed['rt'].mean()
            opt = trimmed['is_opt'].mean()
            # MCF
            mcf = pd.read_csv(parsed_dir + sub + '_MCF.csv')
            mcfrl = mcf['run_len'].mean()
            mcfrn = mcf['run_number'].mean()
            mcfrt = mcf['rt'].mean()
            # ACVF
            acf = pd.read_csv(parsed_dir + sub + '_ACF.csv')
            acfrl = acf['run_len'].mean()
            acfrn = acf['run_number'].mean()
            acfrt = acf['rt'].mean()
            acfopt = acf['optimality'].mean()
            # Mouse Click Baseline
            baseline = pd.read_csv(parsed_dir + sub + '_Baseline.csv')
            blrawmeanrt = baseline['rt'].mean()
            blrawstdrt = baseline['rt'].std()
            baseline_trimmed = baseline[baseline['rt']
                                        > blrawmeanrt-3*blrawstdrt]
            baseline_trimmed = baseline_trimmed[baseline['rt']
                                                < blrawmeanrt+3*blrawstdrt]
            blrt = baseline_trimmed['rt'].mean()
            csv_writer.writerow(
                [sub, acc, rt, opt, mcfrl, mcfrn, mcfrt, acfrl, acfrn, acfrt, acfopt, blrt])
    f.close()


if __name__ == "__main__":
    main()
