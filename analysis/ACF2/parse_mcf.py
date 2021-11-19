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
                        if not (sub_id + '_MCF.csv') in os.listdir('Data/Parsed'):
                            with open(out_dir + sub_id + '_MCF.csv', 'w') as f:
                                csvWriter = csv.writer(f)
                                csvWriter.writerow(
                                    ['id', 'age', 'gender', 'block', 'trial', 'run_len', 'run_number', 'rt', 'wrong_attempts'])
                                for bi in [4]:
                                    block = blocks[bi]
                                    for trial in block:
                                        trial_data = [
                                            sub_id,
                                            age,
                                            gender,
                                            trial['blockNumber'],
                                            trial['blockTrial'],
                                            trial['run_length'],
                                            trial['run_number'],
                                            trial['rt'],
                                            trial['n_wrong_attempt']
                                        ]
                                        csvWriter.writerow(trial_data)
                            print('Finished parsing subject ' + sub_id)


if __name__ == "__main__":
    main()
