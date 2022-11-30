import formidable, { Fields, Files, File } from 'formidable';
import IncomingForm from 'formidable/Formidable';
import { NextApiRequest } from 'next';
import { PassThrough, Writable } from 'node:stream';

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: Fields; files: Files; form: IncomingForm }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files, form });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    }
  });

  return writable;
};

export async function parseForm(req: NextApiRequest) {
  const chunks: never[] = [];
  const { files: raw, form } = await formidablePromise(req, {
    ...formidableConfig,
    fileWriteStreamHandler: () => fileConsumer(chunks)
  });

  const fileInfo: File = raw.media as File;
  const fileData = Buffer.concat(chunks);

  return { fileInfo, fileData, form };
}
