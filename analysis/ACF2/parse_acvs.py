import os
import json
import csv


def main():
    data_dir = 'Data/Raw/'
    out_dir = 'Data/Parsed/'
    for sub in os.listdir(data_dir):
        if os.path.isdir(data_dir + sub):
            for fname in os.listdir(data_dir + sub):
                if (fname.startswith('data')):
                    with open(data_dir + sub + '/' + fname, 'r') as dataFile:
                        data = dataFile.read()
                        # Trim data from seriealized php string to JSON
                        data = data[data.rindex(
                            '_database_created_at')-2:len(data)-3]
                        # Parse it to a JSON object
                        data = json.loads(data)
                        # Get user data
                        sub_id = data['_user_data']['prolific_id']
                        age = data['_user_data']['self_reported_age']
                        gender = data['_user_data']['self_reported_gender']
                        blocks = data['ExperimentTable']['AllTrialsData']
                        # If subject data is not parsed already
                        if not (sub_id + '_ACVS.csv') in os.listdir('Data/Parsed'):
                            with open(out_dir + sub_id + '_ACVS.csv', 'w') as f:
                                csvWriter = csv.writer(f)
                                csvWriter.writerow(['id', 'age', 'gender', 'block', 'trial', 'opt_targ_ecc', 'non_opt_targ_ecc',
                                                    'opt_targ_digit', 'non_opt_targ_digit', 'opt_targ_color',
                                                    'non_opt_targ_color', 'response', 'rt', 'is_acc', 'is_opt'])
                                for bi in [1]:
                                    block = blocks[bi]
                                    for trial in block:
                                        trial_data = [
                                            sub_id,
                                            age,
                                            gender,
                                            trial['blockNumber'],
                                            trial['blockTrial'],
                                            trial['logic']['optTargEcc'],
                                            trial['logic']['nonOptTargEcc'],
                                            trial['logic']['optTargDigit'],
                                            trial['logic']['nonOptTargDigit'],
                                            trial['logic']['optTargColor'],
                                            trial['logic']['nonOptTargColor'],
                                            trial['response'],
                                            trial['rt'],
                                            trial['acc'],
                                            1 if trial['acc'] == 1 and trial['response'] == trial['logic'][
                                                'optTargDigit'] else 0 if trial['acc'] == 1 else -1,
                                        ]
                                        csvWriter.writerow(trial_data)
                            print('Finished parsing subject ' + sub_id)


if __name__ == "__main__":
    main()
