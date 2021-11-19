import os
import pandas as pd


def main():
    data_dir = 'Data/Demographic/'
    output_file = 'demographics.csv'
    fnames = [data_dir + i for i in os.listdir(
        data_dir) if i.endswith('csv') and not i == 'demographics.csv']
    concated = pd.concat([pd.read_csv(f) for f in fnames])
    concated.to_csv(data_dir + output_file, index=False)
    print('Demographic csv files concatenated to ' + data_dir + output_file)


if __name__ == "__main__":
    main()
