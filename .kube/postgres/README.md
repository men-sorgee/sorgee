# postgres-statefulset

This is a StatefulSets to get a Postgres instance running with replication enabled. This uses the [standard Postgres container](https://github.com/docker-library/postgres). Blog article [here](https://stacksoft.io/blog/postgres-statefulset/)

The work here is based on the official documentation here https://wiki.postgresql.org/wiki/Streaming_Replication

## Running

### Start Master servers

Run `kubectl apply -k .kube/postgres` and wait for Master to be running

### Start Master service (IMPORTANT or replica cannot find the master)

Run `kubectl apply -f service.yml`

### Start Replica server

Run `kubectl apply -f statefulset-replica.yml` and wait for Replica to be running

If you run `kubectl logs -f postgres-replica-0`, you can see in the logs that it starts replication:

```
2019-01-08 05:07:01.035 UTC [24] LOG:  started streaming WAL from primary at 0/6000000 on timeline 1
```
